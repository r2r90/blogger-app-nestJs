```toml
name = 'REGISTRATION-CONFIRMATION'
method = 'POST'
url = '{{baseUrl}}/auth/registration-confirmation'
sortWeight = 5437500
id = '30c62e3f-a651-46b5-81a4-955258c307e8'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "code": "cb6cd5c8-38bb-40a2-9ebd-7dbbf7d1f70a"
}'''
```
