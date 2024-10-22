```toml
name = 'REGISTRATION'
method = 'POST'
url = '{{baseUrl}}/auth/registration'
sortWeight = 3000000
id = 'ecb7304b-0183-486a-9225-3465261ad841'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "login": "artur-test",
  "password": "123456",
  "email": "aghartur@gmail.com"
}'''
```
