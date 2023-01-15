## Node Speech to Text

This is a simple command line app for testing audio recording and speech recognition in Node.
It uses the node-audiorecorder package and the Azure Cognitive Services SDK.

To make use of the speech recognition feature, you need to have a subscription to Azure, create a speech recognition service and copy the subscription key and region to the environment variables COGNITIVE_SERVICES_KEY and SERVICE_REGION, respectively. You also need to set the the variable RECOGNITION_LANGUAGE to the language of your choice.

Please note that unless you have a free tier subscription in Azure, you may incur some costs, which depend on your region.

