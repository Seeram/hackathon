
service_report = {"Report ID":None, "Ticket Number":None, "Building Address":None, "Date & Time of Service":None,"Technician ID":None, "Spare Parts Replaced":None, "Service Duration (min)":None, "Technician Confidence Level (1–5)":None, "Safety Assessment (Safe/Unsafe)":None, "Additional Comments":None}

def postprocess_service_report(report_dict):
    # Get input from user on how the task went
    # Collect any images if necessary

    # TODO Load all interactions during dialogue
    context = None

    uncertainty_threshold = 1.
    while uncertainty < uncertainty_threshold:
        # TODO Process loaded interactions

        # TODO Fill dictionary, based on uncertainty

        # TODO Compute current uncertainty over each field entry
        pass

def postprocess_validation():
    # User should validate final service report

    # TODO Summarize final service report dictionary

    acceptable = False
    # TODO Receive voice input from user
    while not acceptable:
        # TODO Update service report dictionary
        pass

    pass
