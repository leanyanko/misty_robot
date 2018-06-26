function Activate() {
	misty.Debug("Starting EP0ForwardDrive Test...");	
	misty.Drive(50, 0, 0, 1000);
	Deactivate();	
}


function Deactivate() {
	misty.Debug("Deactivating EP0ForwardDrive test...");
	misty.Stop();	
}
