```toml
name = 'NEW PASSWORD'
method = 'POST'
url = '{{baseUrl}}/auth/new-password'
sortWeight = 6000000
id = 'b84986aa-d90d-4dbc-97d7-bc2dc08052ac'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "newPassword": "string",
  "recoveryCode": "string"
}'''
```
