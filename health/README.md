# Health

Copy or clone source code into your `ixi` directory such that it can be found as `ixi/health/{index.js, package.json}`. 
Your node may be running at this time, and it will hot-load the script. 
After you've cloned it, and with a running iri node, run the following command to see the node health status:

```
curl http://localhost:14265 -X POST -H 'X-IOTA-API-Version: 1.4.1' -H 'Content-Type: application/json'   -d '{"command": "health.getHealth"}'
```

-----

#### Troubleshooting:

If something goes wrong... were all doomed

