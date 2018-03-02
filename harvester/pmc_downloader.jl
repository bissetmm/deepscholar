const baseurl = "https://www.ncbi.nlm.nih.gov/pmc/oai/oai.cgi"
const metadataPrefix = "pmc_fm"
const prefix = "pmc"

include("oai-pmh.jl")

downloadxml(Date("2008-04-24"), Date("2018-02-12"))
