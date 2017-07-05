const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/api/search", (req, res) => {
  res.json(
    [
      {
        "booktitle": "Sixth Applied Natural Language Processing Conference",
        "author": "Bagga, Amit and Strzalkowski, Tomek and Bowden, G.",
        "year": "2000",
        "id": "A00-1005",
        "title": "PartsID: A Dialogue-Based System for Identifying Parts for Medical Systems",
        "abstract": "Abstractsequenceofoptionsthatwillgetthemthe desired information. Therefore, any change in This paper describes a system that the options greatly inconveniences these users.provides customer service by allowing Moreover, there are users that always hit 0 to users to retrieve identification numbers of speak to a live operator because they prefer to parts for medical systems using spoken deal with a human instead of a machine.natural language dialogue. The paper also Finally, as customer service providers continue presents an evaluation of the system to rapidly add functionality to their IVR which shows that the system successfully systems, the size and complexity of these retrieves the identification numbers of systems continues to grow proportionally. In approximately 80% of the parts.some popular systems like the IVR system that provides customer service for the Internal Introduction Revenue Service (IRS), the user is initially Currently people deal with customer service bombarded with 10 different options with each centers either over the phone or on the world option leading to sub-menus offering a further 3-wide web on a regular basis. These service 5 options, and so on. The total number of nodes centers support a wide variety of tasks including in the tree corresponding to the IRS' IVR system checking the balance of a bank or a credit card is quite large (approximately 100) making it account, transferring money from one account to extremely complex to use. Some customer service providers have income tax returns. Most of these customer started to take advantage of the recent advances service centers use interactive voice response in speech recognition technology. Therefore,(IVR) systems on the front-end for determining some of the IVR systems now allow users to say the user's need by providing a list of options that the option number (1, 2, 3..... etc.) instead of the user can choose from, and then routing the pressing the corresponding button. In addition,call appropriately. The IVRs also gather some providers have taken this a step further by essential information like the user's bank allowing users to say a keyword or a phrase account number, social security number, etc. from a list of keywords and/or phrases. For For back-end support, the customer service example, AT&T, the long distance company,centers use either specialized computer systems provides their users the following options:(example: a system that retrieves the account \"\"Please say information for information on balance from a database), or, as in most cases, placing a call, credit for requesting credit, or human operators.",
        "url": "http://aclweb.org/anthology/A00-1005"
      },
      {
        "booktitle": "Sixth Applied Natural Language Processing Conference",
        "author": "Jonsson, Arne and Dahlback, Nils",
        "year": "2000",
        "id": "A00-1007",
        "title": "Distilling dialogues - A method using natural dialogue corpora for dialogue systems development",
        "abstract": "e report on a method for utilising corpora collected in natural settings. It is based on distilling(re-writing) natural dialogues to elicit the type of dialogue that would occur if one the dialogue participants was a computer instead of a human. The method is a complement to other means such as Wizard of Oz-studies and un-distilled natural dialogues. We present the distilling method and guidelines for distillation. We also illustrate how the method affects a corpus of dialogues and discuss the pros and cons of three approaches in different phases of dialogue systems development",
        "url": "http://aclweb.org/anthology/A00-1007"
      },
      {
        "booktitle": "Sixth Applied Natural Language Processing Conference",
        "author": "Busemann, Stephan and Schmeier, Sven and G. Arens, Roman",
        "year": "2000",
        "id": "A00-1022",
        "title": "Message Classification in the Call Center",
        "abstract": "Customer care in technical domains is increasingly based on e-mail communication, allowing for the reproduction of approved solutions. Identifying the customer's problem is often time-consuming, as the problem space changes if new products are launched. This paper describes a new approach to the classification of e-mail requests based on shallow text processing and machine learning techniques. It is implemented within an assistance system for call center agents that is used in a commercial setting.",
        "url": "http://aclweb.org/anthology/A00-1022"
      },
      {
        "booktitle": "Sixth Applied Natural Language Processing Conference",
        "author": "Toole, Janine",
        "year": "2000",
        "id": "A00-1024",
        "title": "Categorizing Unknown Words: Using Decision Trees to Identify Names and Misspellings",
        "abstract": "his paper introduces a system for categorizing unknown words. The system is based on a multi-component architecture where each component is responsible for identifying one class of unknown words. The focus of this paper is the components that identify names and spelling errors. Each component uses a decision tree architecture to combine multiple types of evidence about the unknown word. The system is evaluated using data from live closed captions- a genre replete with a wide variety of unknown words",
        "url": "http://aclweb.org/anthology/A00-1024"
      },
      {
        "booktitle": "Sixth Applied Natural Language Processing Conference",
        "author": "Cardiel, Claire and Ng, Vincent and Pierce, David and Buckley, Chris",
        "year": "2000",
        "id": "A00-1025",
        "title": "Examining the Role of Statistical and Linguistic Knowledge Sources in a General-Knowledge Question-Answering System",
        "abstract": "We describe and evaluate an implemented system for general-knowledge question answering. The system combines techniques for standard ad-hoc information retrieval (IR), query-dependent text summa-rization, and shallow syntactic and semantic sentence analysis. In a series of experiments we examine the role of each statistical and linguistic knowledge source in the question-answering system. In contrast to previous results, we find first that statistical knowledge of word co-occurrences as computed by IR vector space methods can be used to quickly and accurately locate the relevant documents for each question. The use of query-dependent text summarization techniques, however, provides only small increases in performance and severely limits recall levels when inaccurate. Nevertheless, it is the text summarization component that allows subsequent linguistic filters to focus on relevant passages. We find that even very weak linguistic knowledge can offer substantial improvements over purely IR-based techniques for question answering, especially when smoothly integrated with statistical preferences computed by the IR subsystems.",
        "url": "http://aclweb.org/anthology/A00-1025"
      }
    ]
  );
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});