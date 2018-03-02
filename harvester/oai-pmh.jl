using EzXML

function downloadxml(date::Date=Date(now())-Dates.Day(1))
    y, m, d = Dates.year(date), Dates.month(date), Dates.day(date)
    format(num::Int) = num < 10 ? "0$num" : "$num"
    ymd = "$y-$(format(m))-$(format(d))"
    url = "$baseurl?verb=ListRecords&metadataPrefix=$metadataPrefix&from=$ymd&until=$ymd"

    doc = XMLDocument()
    root = setroot!(doc, ElementNode("OAI-PMH"))
    listrecords = link!(root, ElementNode("ListRecords"))
    while true
        xml = readxml(download(url))
        sleep(10)
        records = find(xml, "/*/*[3]/*")
        resumptionToken = ""
        for r in records
            name = nodename(r)
            if name == "record"
                unlink!(r)
                link!(listrecords, r)
            elseif name == "resumptionToken"
                resumptionToken = nodecontent(r)
            end
        end
        isempty(resumptionToken) && break
	println("resumptionToken=$resumptionToken")
        url = "$baseurl?verb=ListRecords&resumptionToken=$resumptionToken"
    end
    hasnode(listrecords) && write(joinpath(@__DIR__,"$prefix/$prefix$ymd.xml"), doc)
end

function downloadxml(from::Date, until::Date)
    date = from
    while date <= until
        println(date)
        downloadxml(date)
        date += Dates.Day(1)
    end
end
