```toml
name = 'LOGIN'
method = 'POST'
url = '{{baseUrl}}/auth/login'
sortWeight = 8000000
id = 'c1cb14ac-f03d-40c2-8d1f-7955111e4e20'

[auth]
type = 'BEARER'

[body]
type = 'JSON'
raw = '''
{
  "loginOrEmail": "artur-test",
  "password": "123456"
}'''
```
