```toml
name = 'GET USERS'
method = 'GET'
url = '{{baseUrl}}/sa/users?sortBy=login&sortDirection=asc&searchLoginTerm=test'
sortWeight = 1000000
id = 'd9614e31-70cc-4718-bd34-ba3b60f0ab97'

[[queryParams]]
key = 'sortBy'
value = 'login'

[[queryParams]]
key = 'sortDirection'
value = 'asc'

[[queryParams]]
key = 'searchLoginTerm'
value = 'test'

[auth.basic]
username = 'admin'
password = 'qwerty'
```
