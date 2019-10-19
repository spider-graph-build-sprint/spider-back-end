# spider-back-end
This is the back-end repository for the Build Sprint Project: Spider Graph

https://spider-back-end.herokuapp.com/

### User Schema

Users in the database conform to the following object structure:

```js
{
  username: "name", // String, required
  password: "password",  // String, required
}
```

### Endpoints for the user

| Method  |      URL           |     Description                |
| ------- | ------------------ |------------------------------- | 
| POST    | /api/auth/register | Creates a new user and returns an id of newly created user |
| POST    | /api/auth/login    | Returns the token for the user |

### Graph

### Graph

 #### Create a new graph
`/api/graphs/`
 
 **Payload:** _an object with the following credentials:_
 
 **Required:** `name`, `legs`
```
 {
   "name": "Name of the graph",
   "legs": ["leg1", "leg1", "leg2"]
 }
```

 #### Get graph
`/api/graphs/${name}`
 
 **Success-Response:** 
```
 [{
     "name": "Make tea1",
     "legs": ["leg1", "leg1", "leg2"],
     "datasets": [
       {
         "name": "dataset1",
         "points": [2, 3, 5]
       },
       {
         "name": "dataset1",
         "points": [2, 3, 5]
       },
     ]
}]
```

 #### Get graphs
`/api/graphs/`
 
 **Success-Response:** 
```
 [
   {
     "id": 12,
     "name": "Make tea1",
     "user_id": 11
   },
   {
     "id": 14,
     "name": "Make tea122",
     "user_id": 11
   },
   {
     "id": 15,
     "name": "Make coffee",
     "user_id": 11
   }
 ]
    
```

 #### Update graph
`/api/graphs/${name}`

 **Payload:** _an object with the following credentials:_
 
 **Required:** `name`, `legs`
```
 {
   "name": "Name of the graph",
   "legs": ["leg1", "leg1", "leg2"]
 }
``` 

#### Delete graph
`/api/graphs/${name}`
 
 **Success-Response:** 
```
  {
   "name": "graph_name",
  }
```

### Dataset
 #### Create a new dataset
` /api/graphs/${graph_name}/dataset `
 
 **Payload:** _an object with the following credentials:_
 
 **Required:** `title`, `points`
```
  {
   "title": "dataset1",
   "points": [2,3,5]
  }
```
 #### Update dataset 
` /api/graphs/${graph_name}/dataset/${dataset_name}`

 **Payload:** _an object with the following credentials:_
 
 **Required:** `title`, `points`
```
  {
   "title": "dataset1",
   "points": [2,3,5]
  }
``` 
#### Delete dataset 
` /api/graphs/${graph_name}/dataset/${dataset_name}`
 
 **Success-Response:** 
```
  {
   "title": "dataset1",
  }
```

