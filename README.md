<p align="center"><img src="https://github.com/paperai/deepscholar/blob/master/logo/deepscholar_logo.png" width="400"></p>

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

## Create .env to set environment variables to Docker

1. Copy from .env.example
    ```
    $ cd deepscholar
    $ cp .env.example .env
    ```

2. Edit .env  
    ```
    DS_FRONT_PORT=8080
    DS_CLIENT_PORT=3000
    DS_SERVER_PORT=3001
    DS_ES_PORT=9200
    DS_KIBANA_PORT=5601
    DS_ESHEAD_PORT=9100
    OAUTH_GITHUB_CLIENT_ID=12345678901234567890
    OAUTH_GITHUB_CLIENT_SECRET=1234567890123456789012345678901234567890
    DEEP_SCHOLAR_URL=http://localhost:8080
    DEEP_SCHOLAR_TOKEN_SECRET=12345678901234567890
    DEEP_SCHOLAR_TOKEN_ISSUER=DEEP_SCHOLAR
    DEEP_SCHOLAR_TOKEN_AUDIENCE=DEEP_SCHOLAR
    ```

## Run application

```
$ cd deepscholar
$ docker-compose up
```

You can see your application at [http://localhost:8080](http://localhost:8080)  
**The port 8080 depends on DS_FRONT_PORT setting.**

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

### Initialize Indexes (Only once)

Create indexes using the following command
```
$ npm -s run es:initializeIndexes
Index(papers) created.
Index(search_histories) created.
```

### Import JSON data

Import json files to ES
```
$ npm -s run es:insertIndexes ~/sample.json
Inserted 482 papers.
Inserted 475 papers.
Inserted 514 papers.
...
```
    
Please define limit bytes to import Elasticsearch's Bulk API using `DS_BULK_LIMIT_BYTE_PER_REQUEST` in .env file.


### Delete indexes
```
$ npm -s run es:deleteIndexes
All Indexes have been deleted.
```

### Delete database
```
$ npm -s run db:dropDatabase
All databases have been deleted.
```

### Export search histories to tsv
```
$ npm run es:dump:searchHistories > searchHistories.tsv 
```

### Development Tools

|        Name        |                      URL                       |
| ------------------ | ---------------------------------------------- |
| Kibana             | [http://localhost:5601](http://localhost:5601) |
| elasticsearch-head | [http://localhost:9100](http://localhost:9100) |

The ports are changed using environment variables.
