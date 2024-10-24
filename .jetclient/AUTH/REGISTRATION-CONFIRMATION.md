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
  "code": "75f31616-d54e-4257-ae0d-29c19798d344"
}'''
```
