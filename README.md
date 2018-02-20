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
You must edit `DS_FIGS_DIR` to define figs dir.
You can also change port settings.
    ```
    DS_FRONT_PORT=8080
    DS_CLIENT_PORT=3000
    DS_SERVER_PORT=3001
    DS_ES_PORT=9200
    DS_KIBANA_PORT=5601
    DS_ESHEAD_PORT=9100
    DS_DATA_DIR=/path/to/data/dir
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

### Data Format
* id
* title
* author
* abstract
* booktitle
* year
* page
* url

### Initialize Indexes (Only once)

Create indexes using the following command
```
$ npm -s run es:initializeIndexes
Index(papers) created.
Index(figs) created.
Index(tables) created.
```

### Import XML data

1. Put xml files into directory anywhere you want  
    ```
    ls -l ~/sample_xml
    total 8432
    -rwxr-xr-x@ 1 dataich  staff   2.0K 11  1 04:14 PMC5000010.xml
    -rwxr-xr-x@ 1 dataich  staff   1.5K 11  1 04:14 PMC5000011.xml
    -rwxr-xr-x@ 1 dataich  staff   2.0K 11  1 04:14 PMC5000012.xml
    -rwxr-xr-x@ 1 dataich  staff   1.8K 11  1 04:14 PMC5000013.xml
    -rwxr-xr-x@ 1 dataich  staff   1.9K 11  1 04:14 PMC5000014.xml
    -rwxr-xr-x@ 1 dataich  staff   3.0K 11  1 04:14 PMC5000015.xml
    -rwxr-xr-x@ 1 dataich  staff   2.8K 11  1 04:14 PMC5000080.xml
    -rwxr-xr-x@ 1 dataich  staff   2.1K 11  1 04:14 PMC5000131.xml
    ```
    
2. Import xml files to ES and create symlink to figs
    ```
    $ npm -s run es:insertIndexes ~/sample_xml
    PMC5000011.xml may be invalid format.
    PMC5000131.xml may be invalid format.
    StatusCode: 200
    {"took":118,"errors":false,"items":[{"index":{"_index":"papers","_type":"lang","_id":"PMC5000013","_version":2,"result":"updated","_shards":{"total":2,"successful":1,"failed":0},"created":false,"status":200}},{"index":{"_index":"figs","_type":"lang","_id":"AWAsKiszG0FqIxQhXoQP","_version":1,"result":"created","_shards":{"total":2,"successful":1,"failed":0},"created":true,"status":201}},
    ```

    Then figs can be referenced in `server/public/figs`. 
    ```
    ls -l server/public/figs/**/*.png
    -rw-r--r--  1 dataich  staff  105284 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_1.png
    -rw-r--r--  1 dataich  staff  239564 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_2.png
    -rw-r--r--  1 dataich  staff  108743 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_3.png
    -rw-r--r--  1 dataich  staff  722954 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_4.png
    -rw-r--r--  1 dataich  staff  451885 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_5.png
    ```

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
