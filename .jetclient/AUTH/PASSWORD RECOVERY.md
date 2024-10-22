```toml
name = 'PASSWORD RECOVERY'
method = 'POST'
url = '{{baseUrl}}/auth/password-recovery'
sortWeight = 5625000
id = '84ab665d-764a-4695-a2a8-89f0d3f4d1e7'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "email": "useremail@company.com"
}'''
```
