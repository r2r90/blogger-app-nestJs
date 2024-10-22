```toml
name = 'UPDATE POST'
method = 'PUT'
url = '{{baseUrl}}/posts/67164b7bf1e0d5fadda10658'
sortWeight = 4000000
id = '4e2ec756-dd11-4885-9418-65e4100d6c78'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "title": "new test POST POST TEST",
  "shortDescription": "qpsldj qsdpkdqskndsq dqskqsdjqsdkjqsdk",
  "content": "https://my-test.com TEST TEST ",
  "blogId": "67164994f1e0d5fadda1063c"
}'''
```
