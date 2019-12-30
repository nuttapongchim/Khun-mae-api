# CareCruch_API v.1.0.0

<table>
    <tr>
        <th>Name</th>
        <th>Method</th>
        <th>Action</th>
        <th>Parameter</th>
        <th>Detail</th>
    </tr>
    <tr>
        <td rowspan="5">Member</td>
        <td>get</td>
        <td>/api/v1/members</td>
        <td>-</td>
        <td>get all member</td>
    </tr>
    <tr>
        <td>get</td>
        <td>/api/v1/member/:id</td>
        <td>[id]</td>
        <td>get member by id</td>
    </tr>
    <tr>
        <td>post</td>
        <td>/api/v1/create_member</td>
        <td>[username]<br>[password]<br>[firstname]<br>[lastname]<br>[weight]<br>[height]<br></td>
        <td>create member</td>
    </tr>
    <tr>
        <td>put</td>
        <td>/api/v1/edit_member/:id</td>
        <td>[id]</td>
        <td>edit member</td>
    </tr>
    <tr>
        <td>delete</td>
        <td>/api/v1/delete_member/:id</td>
        <td>[id]</td>
        <td>delete member</td>
    </tr>
    <tr>
        <td rowspan="3">Food</td>
        <td>get</td>
        <td>/api/v1/foods</td>
        <td>-</td>
        <td>get all food</td>
    </tr>
    <tr>
        <td>get</td>
        <td>/api/v1/food/:id</td>
        <td>[id]</td>
        <td>get food by id</td>
    </tr>
    <tr>
        <td>get</td>
        <td>/api/v1/food/:foodtype_id</td>
        <td>[foodtype_id]</td>
        <td>get food by foodtype_id</td>
    </tr>
    <tr>
        <td rowspan="1">FoodType</td>
        <td>get</td>
        <td>/api/v1/foodtypes</td>
        <td>-</td>
        <td>get all foodtype</td>
    </tr>
</table>

<h3><i>Power by express.js</i></h3># KhunMeaApi
# KhunMeaApi
# khun-mea-app-api
# Khun-mae-api
