using EzXML

function downloadxml(date::Date=Date(now())-Dates.Day(1))
    y, m, d = Dates.year(date), Dates.month(date), Dates.day(date)
    format(num::Int) = num < 10 ? "0$num" : "$num"
    ymd = "$y-$(format(m))-$(format(d))"
    url = "$baseurl&from=$ymd&until=$ymd"

    doc = XMLDocument()
    root = setroot!(doc, ElementNode("OAI-PMH"))
    records = link!(root, ElementNode("ListRecords"))
    while true
        xml = readxml(download(url))
        sleep(10)
        for r in find(xml,"//record")
            unlink!(r)
            link!(records, r)
        end
        nodes = find(xml, "//resumptionToken")
        isempty(nodes) && break
        token = nodecontent(nodes[1])
        isempty(token) && break
        url = "$baseurl&resumptionToken=$token"
    end
    hasnode(records) && write(joinpath(@__DIR__,"$prefix/$prefix$ymd.xml"), doc)
end

function downloadxml(from::Date, until::Date)
    date = from
    while date <= until
        println(date)
        downloadxml(date)
        date += Dates.Day(1)
    end
end

function readxml(path::String)
    str = open(readstring, path)
    for tag in tags
        b = search(str, "<$tag")
        first(b) <= 0 && continue
        e = search(str, ">", last(b))
        str = str[1:last(b)] * str[first(e):end]
    end
    parsexml(str)
end
