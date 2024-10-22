```toml
name = 'UPDATE POST'
method = 'PUT'
url = '{{baseUrl}}/posts/67164b7bf1e0d5fadda10658'
sortWeight = 4000000
id = '970ede16-a14a-42a5-894e-19ef83e791c4'

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
