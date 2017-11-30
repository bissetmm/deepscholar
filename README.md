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

### Create Index (Only once)

Create index using the following command
```
cd index_schemes
# The port should be same as environment variables $DS_ES_PORT
curl -XPUT 'http://localhost:9200/papers' --data-binary @papers.json
curl -XPUT 'http://localhost:9200/figs' --data-binary @figs.json
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
    
2. Convert xml files to ES json and import to ES  
    ```
    # The port should be same as environment variables $DS_ES_PORT
    npm -s run convert example/sample_xml | curl -XPOST "localhost:9200/_bulk" --data-binary @- | echo
    PMC5000294.xml may be invalid format.
    PMC5000402.xml may be invalid format.
    PMC5000407.xml may be invalid format.
    {"took":290,"errors":false,"items":[{"index":{"_index":"papers","_type":"lang","_id":"PMC5000011","_version":1,"result":"created","_shards":{"total":2,"successful":1,"failed":0},"created":true,"status":200}},{"index":{"_index":"papers","_type":"lang","_id":"PMC5000013","_version":1,"result":"created","_shards":{"total":2,"successful":1,"failed":0},"created":true,"status":200}},...
    ```
    
    **If a XML file is invalid, it is skipped to import.** 

### Import fig data

Run copyFigs command.
```
npm -s run copyFigs example/sample_xml
```

Then figs will be copied into `server/public/figs`. 
```
ls -l server/public/figs/**/*.png
-rw-r--r--  1 dataich  staff  105284 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_1.png
-rw-r--r--  1 dataich  staff  239564 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_2.png
-rw-r--r--  1 dataich  staff  108743 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_3.png
-rw-r--r--  1 dataich  staff  722954 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_4.png
-rw-r--r--  1 dataich  staff  451885 11 26 22:01 server/public/figs/PMC5000010/PMC5000010_5.png

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
