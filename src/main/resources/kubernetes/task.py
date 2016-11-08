#
# THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS
# FOR A PARTICULAR PURPOSE. THIS CODE AND INFORMATION ARE NOT SUPPORTED BY XEBIALABS.
#

from kubernetes.api_client import APIClient

if not task.pythonScript.getProperty('spec')  and not task.pythonScript.getProperty('url'):
    raise Exception('No source for input file (inline|URL) is provided')
elif task.pythonScript.getProperty('spec')  and task.pythonScript.getProperty('url'):
    raise Exception('Please provide only one source for input file(inline|url)')

host = task.pythonScript.getProperty("host")
client = APIClient(host,task.pythonScript.getProperty('kubectlPath'))

spec = task.pythonScript.getProperty('spec')
if not spec:
    spec = APIClient.download_file(task.pythonScript.getProperty('url'),task.pythonScript.getProperty('username'),task.pythonScript.getProperty('password'))

response = client.execute_kubernetes_spec(spec,task.pythonScript.getProperty('command'),task.pythonScript.getProperty('cmdParams'))
