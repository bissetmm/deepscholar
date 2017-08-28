# Deep Scholar

## Requirements

### Install Docker
- [Docker for Mac](https://www.docker.com/docker-mac)
- [Docker for Windows](https://www.docker.com/docker-windows)

### Install development dependencies

```
$ cd deepscholar
$ npm install
```

## Run application 

```
$ cd deepscholar
$ docker-compose up
```

You can see your application at [http://localhost:3000](http://localhost:3000)

## Developer's Guide
```
tree client/src
client/src
├── api.js # API for Elasticsearch
├── components # Single React components
│   ├── index.js
│   └── style.css
├── containers # React components (container) for each page
│   ├── App # Entire application
│   │   ├── index.js
│   │   └── style.css
│   ├── Detail # Details of document
│   │   ├── index.js
│   │   └── style.css
│   └── Search # Search screen
│       └── index.js
├── index.js # Starting point of React
├── module.js # Related to Redux
└── registerServiceWorker.js # Something made by templates (not used yet)
```

### Data Format
* id
* title
* author
* abstract
* booktitle
* year
* page
* url

### Import

1. Create data file named `acl_metadata` like the following  
    ```
    { "index":  { "_index": "documents", "_type": "lang" }}
    {"booktitle":"...","author":["...","...","..."], ...}
    { "index":  { "_index": "documents", "_type": "lang" }}
    {"booktitle":"...","author":["...","...","..."], ...}
    ...
    ```
    
    - 1st line says the next line should be imported as record.
    - 2nd line is the data should be imported
    - Loop those 2 lines for each records

2. Import data using `curl`
    ```
    curl -XPOST "localhost:9200/documents/_bulk" --data-binary @acl_metadata
    ``` 
 
### Delete
```
curl -XDELETE http://localhost:9200/*
```

### Development Tools

|        Name        |                      URL                       |
| ------------------ | ---------------------------------------------- |
| Kibana             | [http://localhost:5601](http://localhost:5601) |
| elasticsearch-head | [http://localhost:9100](http://localhost:9100) |