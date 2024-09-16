from urllib.parse import urljoin

def colab_link(relative_path):
    global pathname
    base_colab_url = 'https://colab.research.google.com/github/davidbau/sidn-handbook/blob/main/public'
    project_url = urljoin(pathname, relative_path)
    return base_colab_url + project_url
