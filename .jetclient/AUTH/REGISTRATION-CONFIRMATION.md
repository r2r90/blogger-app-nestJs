```toml
name = 'REGISTRATION-CONFIRMATION'
method = 'POST'
url = '{{baseUrl}}/auth/registration-confirmation'
sortWeight = 4500000
id = '30c62e3f-a651-46b5-81a4-955258c307e8'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "code": "0358a0ac-9ba1-4056-a788-1c0e6e0ec6b6"
}'''
```
