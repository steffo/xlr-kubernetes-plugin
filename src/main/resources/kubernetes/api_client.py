import sys
import urllib2
import base64
import com.xebialabs.xlrelease.plugin.kubernetes.RemoteScript as RemoteScript

class APIClient:

    def __init__(self, host,kubectl_path):
        self.remote = RemoteScript(host)
        self.kubectl_path = kubectl_path


    def execute_kubernetes_spec(self, spec, command ,cmd_params = None):
        response = self.remote.executeKubernetesSpec(spec,'%s %s %s -f ' % (self.kubectl_path, command, cmd_params if cmd_params else ''))
        APIClient.print_logs(response)
        return response

    def execute_command(self,command):
        response = self.remote.executeScript(command)
        APIClient.print_logs(response)
        return response

    @staticmethod
    def download_file(url, username, password):
        request=urllib2.Request(url)
        if (username is not None) and (password is not None):
            base64string = base64.encodestring('%s:%s' % (username, password))[:-1]
            auth_header =  "Basic %s" % base64string
            request.add_header("Authorization", auth_header)

        return urllib2.urlopen(request).read()

    @staticmethod
    def print_logs(response):
        output = response.stdout
        error = response.stderr
        if response.rc == 0:
            print "```"
            print output
            print "```"
        else:
            print "Exit code: "
            print response.rc
            print
            print "#### Output:"
            print "```"
            print output
            print "```"

            print "----"
            print "#### Error stream:"
            print "```"
            print error
            print "```"
            print

            sys.exit(response.rc)