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
  "code": "a1846cfe-65a6-4c13-baed-6afa4be83dc6"
}'''
```
