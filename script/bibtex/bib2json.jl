using JSON

function bib2json(bibfile::String)
    jsonstr = readstring(`node Bib2JSON.js $bibfile`)
    json = JSON.parse(jsonstr)
    map(json) do dict
        etype = dict["EntryType"]
        res = Dict()
        if etype == "inproceedings"
            fields = dict["Fields"]
            res["author"] = parse_author(fields["author"])
            res["title"] = fields["title"]
            res["booktitle"] = fields["booktitle"]
            res["year"] = parse(Int, fields["year"])
            res["pages"] = fields["pages"]
            res["abstract"] = get(fields, "abstract", "")
            res["url"] = get(fields, "url", "")
            parse_ACL!(res)
            println(JSON.json(res))
        else
            throw("")
        end
    end
end

function parse_author(str::String)
    authors = split(str, "and")
    map(authors) do author
        map(split(author, ",")) do name
            strip(String(name))
        end
    end
end

function parse_ACL!(dict::Dict)
    dict["booktitle"] = "CS.ACL.long"
    url = dict["url"]
    #id = split(url,"/")[end]
    #dict["id"] = "CS.ACL.$id"
    dict["url"] = url * ".pdf"
end

bibfile = joinpath(dirname(@__FILE__), "P17-1.bib")
bib2json(bibfile)
