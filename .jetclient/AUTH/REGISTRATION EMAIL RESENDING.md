```toml
name = 'REGISTRATION EMAIL RESENDING'
method = 'POST'
url = '{{baseUrl}}/auth/registration-email-resending'
sortWeight = 5250000
id = 'e984beef-2583-4374-96b9-ce685206a7e3'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "email": "aghartur@gmail.com"
}'''
```
