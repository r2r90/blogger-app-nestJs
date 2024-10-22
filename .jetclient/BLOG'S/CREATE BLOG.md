```toml
name = 'CREATE BLOG'
method = 'POST'
url = '{{baseUrl}}/blogs'
sortWeight = 3000000
id = 'afe52073-b579-4369-bc30-dcf850004e59'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "name": "new test blog",
  "description": "qpsldj qsdpkdqskndsq dqskqsdjqsdkjqsdk",
  "websiteUrl": "https://my-test.com"
}'''
```
