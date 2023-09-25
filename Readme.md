## API Rate Limiter

API rate limiter restricts the number calls made by a client to an API. The module can be plugged in as a middleware for any endpoint. We can add a rate limit to a specific route or to all the APIs exposed by a service.
This project aims to develop a rate limiter middleware which can be plugged in any application.

### Design
<details open>
    <summary>Use Redis as Memory</summary>
    <ol>
        <li>Design Description</li>
            We use redis store of <code>ipAddress -> counter</code> with a time to live of 1 second to maintain record of number of requests served in the time unit of one second.
        <br/>
    </ol>
</details>
<!-- <details>
    <summary>Use JavaScript HashMap as Memory [Initial Approach]</summary>
    <ol>
        <li>Design Description</li>
            We use a hashmap of <code> ipAddress -> {timestamp: counter} </code> to keep a count of number of requests made by a client in the time unit of one second. We take <code> Date.now() / 1000 </code> as the timestamp for an incoming request. If the counter for a request already has the value of throttle limit, we block the incoming request by reverting and HTTP status code 429 and message.
        <br/>
        <br/>
        <li>Problems with the Design</li>
            <ol>
                <li>
                    We are effectively keeping a fixed window of 1 second to count the number of incoming requests. If a client starts sends requests near end of a second interval, say at 0.99s, we can potentially allow twice the number of requests as the limit.<br>
                    We need a sliding window mechanism to record the time interval. One simple implementation can be to store each record with a time to live (TTL) of 1 second.
                </li>
                <li>
                    The design is suitable only for single server deployments. This will not adapt in case one plans to horizontally scale the API servers.
                </li>
            </ol>
            <ol>
            </ol>
    </ol>
</details> -->



### Example
Refer to [examples/server.ts](examples/server.ts) for a demo implementation of the rate limiter module.