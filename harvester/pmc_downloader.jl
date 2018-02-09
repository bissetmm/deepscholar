const baseurl = "https://www.ncbi.nlm.nih.gov/pmc/oai/oai.cgi?verb=ListRecords&metadataPrefix=pmc_fm"
const prefix = "pmc"
const tags = ["OAI-PMH", "article"]

include("oai-pmh.jl")

downloadxml()
