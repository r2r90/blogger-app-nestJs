```toml
name = 'GET USERS'
method = 'GET'
url = '{{baseUrl}}/sa/users?searchLoginTerm=tes&searchEmailTerm=tester'
sortWeight = 1000000
id = 'd9614e31-70cc-4718-bd34-ba3b60f0ab97'

[[queryParams]]
key = 'searchLoginTerm'
value = 'tes'

[[queryParams]]
key = 'searchEmailTerm'
value = 'tester'

[auth.basic]
username = 'admin'
password = 'qwerty'
```
