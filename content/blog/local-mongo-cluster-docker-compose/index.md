---
title: "Mongo cluster with docker compose - harder that I thought"
date: "2024-08-03T18:15:07.11Z"
description: "After a lot of confusion, hopefully I learned something about docker"
---

Few weeks ago I decided to use mongo db for small side project.
I wanted to leverage change streams to be able to react once new documents are inserted.
However, it turned out I need to run [replica set](https://www.mongodb.com/docs/manual/changeStreams/#availability) to be able to use it.
So, to locally test my application I decided to update my docker-compose.yaml file with mongo instances that form replica set.
My plan was to run my application locally, and connect to DB instance sitting inside docker container(with connection string like _localhost:27017_)

## Come on, how hard can it be?

Supposedly I can run a single node replica set - but what is a fun in that?
Let's have multiple instance, like _real_ replica sets would have.

First thing that came to my mind was I have already done that sort of thing in the past with kafka.
In kafka, you can setup a cluster by configuring 3 properties:
- ADVERTISED_LISTENERS - address that client should use to connect to kafka, for example `localhost`
- LISTENERS - adressed that kafka instances should be listening on, for example `container_name`. 
- CONTROLLER_QUORUM_VOTERS - adresses of all cluster nodes that elect leader node, for example `container_name;container_name2`. 

Much to my suprise, such configuration is not possible with mongo. 

Mongo replica set configuration is done with config like below:

```
var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "mongo1:27017", // Note that we can't reach this DNS from docker host system
            "priority": 2
        },
        {
            "_id": 2,
            "host": "mongo2:27017", // Note that we can't reach this DNS from docker host system
            "priority": 1
        },
        {
            "_id": 3,
            "host": "mongo3:27017", // Note that we can't reach this DNS from docker host system
            "priority": 1,
            "arbiterOnly": true 
        }
    ]
};
```

With mongo, each node in replica set needs to know publicly accessible addresses of other nodes.
Therefore connecting to localhost:27017 is not enough, because after initial connection mongo informs clients about configured adresses of all nodes in replica set. 
Therefore, after connecting initially to `localhost:27017`, my local app client tries to connect to for instance `mongo2:27017` and fails. 


## Quick fix?

Suppose we create following docker compose file
```
  mongo1:
    image: mongo:${MONGODB_VERSION}
    ports:
      - 27017:27017
    # other properties...
  mongo2:
    image: mongo:${MONGODB_VERSION}
    ports:
      - 27018:27017
    # other properties...
  mongo3:
    image: mongo:${MONGODB_VERSION}
    ports:
      - 27019:27017
    # other properties...
```

We can "hack" our DNS by updating hosts file. The hosts file is a plain text file used by operating systems to map hostnames to IP addresses. 
In windows you can find this file in `C:\Windows\System32\drivers\etc\hosts` location.

```
127.0.0.1 mongo1
127.0.0.1 mongo2
127.0.0.1 mongo3
```

However, such solution requires each person working on a project to change his machine configuration. For I discarded it.


## host.docker.internal to the rescue


`host.docker.internal`, is a special DNS name provided by Docker to allow containers to connect to the host machine. The same DNS name can be also used from host machine network.

Only problem with `host.docker.internal` is that it does not work on linux, but we can fix that:

```
  mongo1:
    image: mongo:${MONGODB_VERSION}
    ports:
      - 27017:27017
    extra_hosts: 
      - "host.docker.internal:host-gateway"
        # other properties...
```

The extra_hosts configuration in Docker Compose allows us to add entries to a container's /etc/hosts file. We can use it to map `host.docker.internal` to `host-gateway`, which is new Docker 20.10.0 feature that allows us to resolve host's IP address(but unlike `host.docker.internal` does not work from host machine network).

All that is left for us to do is to change replica set config:

```
var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "host.docker.internal:27017",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "host.docker.internal:27018",
            "priority": 1
        },
        {
            "_id": 3,
            "host": "host.docker.internal:27019",
            "priority": 1,
            "arbiterOnly": true 
        }
    ]
};
```

... And it is working! 

## Conclusion

- `extra_hosts`, `host.docker.internal`, and `host-gateway` are powerfull ways to configure/hack docker networking
- I should looks into alternative ways to connect to services inside docker. Connecting from host machine to docker is not always easy. I would like to run my apps in the same network as my local dependencies.
    - Maybe devcontainers are the solution? I know almost nothing about them, so I am not sure. 