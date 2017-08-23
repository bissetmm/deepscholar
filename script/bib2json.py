#!/usr/bin/python3

"""
A simple script to convert converts a bibtex file of ACL into JSON.
Example: "python3 bibtex2json.py --input input.bib --booktitle ACL"
"""

import sys, os, json, logging
from collections import OrderedDict
import bibtexparser
from bibtexparser.bparser import BibTexParser
from bibtexparser import customization as bib_custom

logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

CONVERT_TO_UNICODE = True


def main():
    from optparse import OptionParser
    parser = OptionParser(
        usage="Usage: %prog [options] intput_file\nExample: python3 bibtex2json.py input.bib --booktitle ACL",
        version="%prog 1.0")
    parser.add_option("-o", "--output",
                      dest="output_file",
                      default="output.json",
                      help="The .json file as the output, DEFAULT is \"output.json\"")
    parser.add_option("-b", "--booktitle",
                      dest="book_title",
                      default="ACL",
                      help="The booktitle, DEFAULT is \"ACL\"")
    (options, args) = parser.parse_args()
    # print (options, args)

    if len(args) != 1:
        parser.print_help()
        parser.error("Wrong number of arguments!\nExample: python3 bibtex2json.py input.bib --booktitle ACL")
        exit(1)

    """
    Script main function: Read the input file and other arguments, and produce the JSON output.
    """
    '''if len(sys.argv) < 2:
        print("will output BibJSON to stdout", file=sys.stderr)
        print("usage: %s <bibtex-file>" % sys.argv[0], file=sys.stderr)
        exit(1)'''

    bibtex_file = args[0]
    book_title = options.book_title

    logger.info("Will output to: " + options.output_file)
    outfile = options.output_file

    output = open(outfile, 'w')

    # read the bibtex file
    with open(bibtex_file) as f:
        bibtex_str = f.read()

        bib_parser = BibTexParser()
        bib_parser.ignore_nonstandard_types = False  # This is flipped. this seems to be an error in the library
        bib_parser.customization = _parse_bib_entry

        bib_obj = bibtexparser.loads(bibtex_str, parser=bib_parser)  # Use "bibtexparser" to parse the input file

        original_outputs = OrderedDict()
        original_outputs['records'] = []  # Store the original outputs from "bibtexparser"
        # set records
        entries = bib_obj.entries_dict
        for key, entry in entries.items():
            original_outputs['records'].append(entry)

        customized_outputs = OrderedDict()
        for key in original_outputs['records'][0]:
            # print (key)
            if key in {"ID", "title", "author", "abstract", "booktitle", "year", "pages", "link"}:
                if key != "ID":  # Do NOT use the original ID from the parser
                    # customized_outputs["id"] = (original_outputs['records'][0][key])
                    if key == "link":  # Rename the key
                        customized_outputs["id"] = book_title + ":" + original_outputs['records'][0][key].split("/")[-1]
                        customized_outputs["url"] = original_outputs['records'][0][key]
                    elif key == "booktitle":
                        customized_outputs["booktitle"] = book_title
                    else:
                        customized_outputs[key] = original_outputs['records'][0][key]

            for key in {"id", "title", "author", "abstract", "booktitle", "year", "pages", "url"}:
                if key not in customized_outputs:
                    customized_outputs[key] = ""  # Output the empty string

        json.dump(customized_outputs, output, indent=True)  # Print to stdout/file with nice indentation

    output.write("\n")
    output.close()
    logger.info("Finished!")


def _parse_bib_entry(entry):
    """
    Customization function for bibtexparser.
    :param entry: bibtex record to modify
    :return bibtex record
    """
    if CONVERT_TO_UNICODE:
        entry = bib_custom.convert_to_unicode(entry)

    entry = bib_custom.author(entry)
    entry = bib_custom.editor(entry)
    entry = bib_custom.keyword(entry)
    entry = bib_custom.page_double_hyphen(entry)

    return entry


if __name__ == '__main__':
    main()
