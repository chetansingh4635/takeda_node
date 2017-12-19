TAKEDA TRY ME API.dev v1.0.1 
=
`NODE` : 8.4.0  
`NPM` : 5.3.0  
`MySQL` : 5.0.12  
`Base URL`: http://ynlhnfju7d.healthcareblocks.com:3090  
`Version` : 1.0.1
## 1. Brand / Details 
>## `GET` */brandingDetails* 
### ***Prameters***
`none`
### ***Request***
`Header` 
""
```
{
    path: "http://ynlhnfju7d.healthcareblocks.com:3090/v1.0.1/brandingDetails",
    method: "GET",
    contentType: "application/json"
    data: {},
    timeout: 15000
}
```
### ***Response***
`Content-Type` : _application/json_

`200`
```
{
	"primary_color": "#fff",
	"default_color": "#fff",
	"info_color": "#fff",
	"danger_color": "#fff",
	"warning_color": "#fff",
	"font_size": "11",
	"logo": "logoURL"
}
 ```
`401`
```
{
	"status": "error",
	"message": "Something went wrong !!"
}
 ``` 
***
 
## 2. User / Signup 
>## `POST` */signup* 
### ***Prameters***
| Parameters       | Optional   | Type       | Default Value | 
|---------------:  |-----------:|------------|---------------|
| _nickName_       | `NO`       | _`String`_ | NONE          |
| _password_       | `NO`       | _`String`_ | NONE          |
| _emailId_       | `NO`       | _`String`_ | NONE          |
|                  |            |            |               |
 
### ***Request***
`Header` 
""
```
{
    path: "http://ynlhnfju7d.healthcareblocks.com:3090/v1.0.1/signup",
    method: "POST",
    contentType: "application/json"
    data: {
	"nickName": "example",
	"password": "example",
	"emailId": "example@unknown.com"
},
    timeout: 15000
}
```
### ***Response***
`Content-Type` : _application/json_

`200`
```
{
	"status": "success",
	"message": "User Successfully registered with us"
}
 ```
`401`
```
{
	"error": "Something went wrong !!"
}
 ``` 
***
 
## 3. User / Login 
>## `POST` */login* 
### ***Prameters***
| Parameters       | Optional   | Type       | Default Value | 
|---------------:  |-----------:|------------|---------------|
| _password_       | `NO`       | _`String`_ | NONE          |
| _emailId_       | `NO`       | _`String`_ | NONE          |
|                  |            |            |               |
 
### ***Request***
`Header` 
""
```
{
    path: "http://ynlhnfju7d.healthcareblocks.com:3090/v1.0.1/login",
    method: "POST",
    contentType: "application/json"
    data: {
	"password": "example",
	"emailId": "example@unknown.com"
},
    timeout: 15000
}
```
### ***Response***
`Content-Type` : _application/json_

`200`
```
{
	"access-token": "Bearer~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImVtYWlsIjoidmFzaW1yYW5hQG1vYmlsZXByb2dyYW1taW5nLm5ldCIsIm5pY2tOYW1lIjoidmFzaW1yYW5hIiwiZXhwIjoxNTA5NDUwNjMwLCJpYXQiOjE1MDkzNjQyMzB9.HzYluiaum0tfW3ntUF7kwlm1KiPndlercDVotSpVEGw"
}
 ```
`401`
```
{
	"error": "Something went wrong !!"
}
 ``` 
***
 
## 4. User / refreshToken 
>## `POST` */refreshToken* 
### ***Prameters***
| Parameters       | Optional   | Type       | Default Value | 
|---------------:  |-----------:|------------|---------------|
| _access-token_       | `NO`       | _`String`_ | NONE          |
|                  |            |            |               |
 
### ***Request***
`Header` 
{"x-access-token":"Bearer~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImVtYWlsIjoicHJhbmF5S2F0aXlhckBtb2JpbGVwcm9ncmFtbWluZy5jb20iLCJuaWNrTmFtZSI6InByYW5heUthdGl5YXIiLCJleHAiOjE1MDk0NTUxNzIsImlhdCI6MTUwOTM2ODc3Mn0.uIo9IFXs4ciG-cQ0hOM8C6D10ZiwMRhzCEAjrDKvSPo"}
```
{
    path: "http://ynlhnfju7d.healthcareblocks.com:3090/v1.0.1/refreshToken",
    method: "POST",
    contentType: "application/json"
    data: {
	"access-token": "abc34o3diveod"
},
    timeout: 15000
}
```
### ***Response***
`Content-Type` : _application/json_

`200`
```
{
	"access-token": "Bearer~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImVtYWlsIjoidmFzaW1yYW5hQG1vYmlsZXByb2dyYW1taW5nLm5ldCIsIm5pY2tOYW1lIjoidmFzaW1yYW5hIiwiZXhwIjoxNTA5NDUwODkwLCJpYXQiOjE1MDkzNjQ0OTB9.0h_uwhwaY_5cBRaN25sX-2Ai4IMa_RZe8lg7Aa8at-w"
}
 ```
`401`
```
{
	"error": "Something went wrong !!"
}
 ``` 
***
 
## 5. User / changePassword 
>## `POST` */changePassword* 
### ***Prameters***
| Parameters       | Optional   | Type       | Default Value | 
|---------------:  |-----------:|------------|---------------|
| _oldPassword_       | `NO`       | _`String`_ | NONE          |
| _newPassword_       | `NO`       | _`String`_ | NONE          |
|                  |            |            |               |
 
### ***Request***
`Header` 
{"x-access-token":"Bearer~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImVtYWlsIjoicHJhbmF5S2F0aXlhckBtb2JpbGVwcm9ncmFtbWluZy5jb20iLCJuaWNrTmFtZSI6InByYW5heUthdGl5YXIiLCJleHAiOjE1MDk0NTUxNzIsImlhdCI6MTUwOTM2ODc3Mn0.uIo9IFXs4ciG-cQ0hOM8C6D10ZiwMRhzCEAjrDKvSPo"}
```
{
    path: "http://ynlhnfju7d.healthcareblocks.com:3090/v1.0.1/changePassword",
    method: "POST",
    contentType: "application/json"
    data: {
	"oldPassword": "abcd",
	"newPassword": "abcd2"
},
    timeout: 15000
}
```
### ***Response***
`Content-Type` : _application/json_

`200`
```
{
	"access-token": "Bearer~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImVtYWlsIjoidmFzaW1yYW5hQG1vYmlsZXByb2dyYW1taW5nLm5ldCIsIm5pY2tOYW1lIjoidmFzaW1yYW5hIiwiZXhwIjoxNTA5NDUwOTg4LCJpYXQiOjE1MDkzNjQ1ODh9.dD7D1G9ydpkN7A8uIh6YlxHkG5ChxdAIhKMNGI8jlGk",
	"status": "success",
	"message": "Password successfully changed"
}
 ```
`401`
```
{
	"error": "Something went wrong !!"
}
 ``` 
***
 
## 6. User / forgotPassword 
>## `POST` */forgotPassword* 
### ***Prameters***
| Parameters       | Optional   | Type       | Default Value | 
|---------------:  |-----------:|------------|---------------|
| _emailId_       | `NO`       | _`email`_ | NONE          |
|                  |            |            |               |
 
### ***Request***
`Header` 
""
```
{
    path: "http://ynlhnfju7d.healthcareblocks.com:3090/v1.0.1/forgotPassword",
    method: "POST",
    contentType: "application/json"
    data: {
	"emailId": "abcd@mobileprogramming.net"
},
    timeout: 15000
}
```
### ***Response***
`Content-Type` : _application/json_

`200`
```
{
	"status": "success",
	"message": "Email successfully send to the user email address"
}
 ```
`401`
```
{
	"status": "error",
	"message": "Email address is not available"
}
 ``` 
***
 
## 7. Document / List 
>## `GET` */documentList* 
### ***Prameters***
`none`
### ***Request***
`Header` 
{"x-access-token":"Bearer~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImVtYWlsIjoicHJhbmF5S2F0aXlhckBtb2JpbGVwcm9ncmFtbWluZy5jb20iLCJuaWNrTmFtZSI6InByYW5heUthdGl5YXIiLCJleHAiOjE1MDk0NTUxNzIsImlhdCI6MTUwOTM2ODc3Mn0.uIo9IFXs4ciG-cQ0hOM8C6D10ZiwMRhzCEAjrDKvSPo"}
```
{
    path: "http://ynlhnfju7d.healthcareblocks.com:3090/v1.0.1/documentList",
    method: "GET",
    contentType: "application/json"
    data: {},
    timeout: 15000
}
```
### ***Response***
`Content-Type` : _application/json_

`200`
```
{
	"document_id": 10,
	"document_label": "Gastroperisis"
}
 ```
`401`
```
{
	"status": "error",
	"message": "Something went wrong !!"
}
 ```
```
{
	"status": "error",
	"message": "No token provided"
}
 ``` 
***
 
## 8. Document / Details 
>## `GET` */{documentID}/documentList* 
### ***Prameters***
| Parameters       | Optional   | Type       | Default Value | 
|---------------:  |-----------:|------------|---------------|
| _documentID_       | `NO`       | _`Number`_ | NONE          |
|                  |            |            |               |
 
### ***Request***
`Header` 
{"x-access-token":"Bearer~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImVtYWlsIjoicHJhbmF5S2F0aXlhckBtb2JpbGVwcm9ncmFtbWluZy5jb20iLCJuaWNrTmFtZSI6InByYW5heUthdGl5YXIiLCJleHAiOjE1MDk0NTUxNzIsImlhdCI6MTUwOTM2ODc3Mn0.uIo9IFXs4ciG-cQ0hOM8C6D10ZiwMRhzCEAjrDKvSPo"}
```
{
    path: "http://ynlhnfju7d.healthcareblocks.com:3090/v1.0.1/{documentID}/documentList",
    method: "GET",
    contentType: "application/json"
    data: {},
    timeout: 15000
}
```
### ***Response***
`Content-Type` : _application/json_

`200`
```
{
	"status": "success",
	"documentDescription": "HTML String",
	"simplifiedDocument": "HTML String"
}
 ```
`401`
```
{
	"status": "error",
	"message": "Something went wrong !!"
}
 ```
```
{
	"status": "error",
	"message": "No token provided"
}
 ``` 
***
 