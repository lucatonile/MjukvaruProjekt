# MjukvaruProjekt
To run server with debug:
SET DEBUG=server:* & npm run devstart

For neural network microservice (.bfr/):
Create a python virtual environment in .bfr/, enter it and run 'pip install -r requirements.txt'.
NOTE: After having installed python libraries, one must also install ImageAI manually:
'pip install https://github.com/OlafenwaMoses/ImageAI/releases/download/2.0.2/imageai-2.0.2-py3-none-any.whl'

To run Gunicorn (after having configured everything):
    sudo systemctl start bfr
    sudo systemctl enable bfr
monitor:
    sudo systemctl status bfr
The neural network models must be downloaded manually extracted to bfr/models.
