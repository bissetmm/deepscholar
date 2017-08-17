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

## Load sample data to Elasticsearch

```
$ ./es/create_index.sh acl_metadata 
```

## Developer's Guide
```
$ tree client/src/components/
client/src/components/
├── App
│   ├── index.js # search index of '/'
│   └── style.css
├── Detail
│   ├── index.js # details of '/documents/:documentId'
│   └── style.css
├── Root
│   ├── index.js # entire screen including headers
│   └── style.css
└── common
    ├── index.js # common part
    └── style.css
```

### Delete
```
curl -XDELETE http://localhost:9200/*
```
