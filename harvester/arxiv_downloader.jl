const baseurl = "http://export.arxiv.org/oai2"
const metadataPrefix = "arXiv"
const prefix = "arxiv"

include("oai-pmh.jl")

downloadxml(Date("2018-02-12"), Date("2018-02-13"))
