<p align="center"><img src="https://github.com/paperai/deepscholar/blob/master/deepscholar_logo.png" width="400"></p>

# DeepScholar
`DeepScholar` is an AI-powered search engine for scholarly papers.

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

## Run application with custom port settings
Default ports settings are defined in `.env` file as environment variables

```
$ cat .env
DS_CLIENT_PORT=3000
DS_SERVER_PORT=3001
DS_ES_PORT=9200
DS_KIBANA_PORT=5601
DS_ESHEAD_PORT=9100
```

If you want to run applications using different ports, pass ports as environment variables.
```
env \
DS_CLIENT_PORT=13000 \
DS_SERVER_PORT=13001 \
DS_ES_PORT=19200 \
DS_KIBANA_PORT=15601 \
DS_ESHEAD_PORT=19100 \
docker-compose up
```

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


1. Create index using the following command
    ```
    cd index_schemes
    # The port should be same as environment variables $DS_ES_PORT
    curl -XPUT 'http://localhost:9200/documents' --data-binary @documents.json
    ```

2. Create data file named `acl_metadata` like the following  
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

3. Import data using `curl`
    ```
    # The port should be same as environment variables $DS_ES_PORT
    curl -XPOST "localhost:9200/documents/_bulk" --data-binary @acl_metadata
    ```

### Delete
```
# The port should be same as environment variables $DS_ES_PORT
curl -XDELETE http://localhost:9200/*
```

### Development Tools

|        Name        |                      URL                       |
| ------------------ | ---------------------------------------------- |
| Kibana             | [http://localhost:5601](http://localhost:5601) |
| elasticsearch-head | [http://localhost:9100](http://localhost:9100) |

The ports are changed using environment variables.
