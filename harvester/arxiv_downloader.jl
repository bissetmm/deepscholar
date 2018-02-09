const baseurl = "http://export.arxiv.org/oai2?verb=ListRecords&metadataPrefix=arXiv"
const prefix = "arxiv"
const tags = ["OAI-PMH", "arXiv"]

include("oai-pmh.jl")

downloadxml()
