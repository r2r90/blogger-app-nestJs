```toml
name = 'CREATE USER'
method = 'POST'
url = '{{baseUrl}}/users'
sortWeight = 3000000
id = 'bab1dc51-51a3-4305-a227-7a049b56a3da'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "login": "WebstormUs",
  "password": "123456789",
  "email": "aghtest@gmail.com"
}'''
```
