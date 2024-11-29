**E-Commerce-Rest Api Guidelines - By Ankan**


**Admin**
1) Admin Registration :
     (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/admin/register-admin
     (b) Request Type: POST
     (c) Variables and credentials Required: **username, email, Password** ( **note:** _Do not change the names of the variables_)
   
2) Admin Email Verification:
     (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/admin/verify-admin
     (b) Request Type: POST
     (c) Variables and credentials Required: **email and code**( _this will be sent to your registered email after registering_ ) ( **note:** _Do not change the names of the variables_)

   **After email verification, the user will be automatically logged in**

3) Admin resend email for verification ( **note:** _this can only be used if the otp gets expired_ )
     (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/admin/resend-otp-admin
     (b) Request Type: POST
     (c) Variables and credentials Required: **email**( _this will be sent to your registered email after registering_ ) ( **note:** _Do not change the names of the variables_)

4) Admin profile
     (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/admin/admin-profile ( **note:**: _The admin should be logged in for getting the profile details_ )
     (b) Request Type: GET
   
5) Admin Login
     (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/admin/admin-login
     (b) Request Type: POST
     (c) Variables and credentials Required: **username,password** ( **note:** _Do not change the names of the variables_)

6) Admin Logout
     (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/admin/admin-logout
     (b) Request Type: POST


**Collections**

**NOTE: FOR CREATING, UPDATING AND DELETING THE COLLECTIONS, YOU MUST BE LOGGED IN AS ADMIN**

1) Create Collections: (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/collection/create-collection (b) Request Type: POST (c) Variables and credentials Required: **collectionName, description**( **note:** _Do not change the names of the variables_ )
2) Get All Collections: (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/collection/get-all-collection (b) Request Type: GET
3) Update Collections:   (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/collection/update-collection (b) Request Type: POST (c) Variables and credentials Required: **collection_id, name, description** ( here collection_id is mandatory to be provided. The name and description are optional, provide the one which needs to be updated) ( **note:** _Do not change the names of the variables_ )
4) Delete Collections: (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/collection/delete-collection (b) Request Type: DELETE (c) Variables and credentials Required: **collectionId**( **note:** _Do not change the names of the variables_ )


**Products**

**NOTE: FOR CREATING, UPDATING AND DELETING THE PRODUCTS, YOU MUST BE LOGGED IN AS ADMIN**

1) Create Products: (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/product/add-product (b) Request Type: POST (c) Variables and credentials Required: **Product_name, Product_description, price, collection_id**( **note:** _Do not change the names of the variables_ ) (d) You will also have to send the product image from the front-end
2) Get All Products: (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/product/get-product (b) Request Type: GET
3) Update Products:   (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/product/update-products (b) Request Type: POST (c) Variables and credentials Required: **id,title,description,price** ( here id is mandatory to be provided. The title,description and price are optional, provide the one which needs to be updated) ( **note:** _Do not change the names of the variables_ )
4) Delete Collections: (a) Link: https://e-commerce-rest-3j7h0vlx6-ankan-devs-projects.vercel.app/app/product/delete-product (b) Request Type: DELETE (c) Variables and credentials Required: **id**( which is product id )( **note:** _Do not change the names of the variables_ )


