function Activate() {
	misty.Debug("Starting Quiet Wander skill!!");
	misty.MoveHeadPosition(-1, 0, 0, 50);	

	misty.ChangeLED(255, 80, 0);/*Orange*/	
	misty.ChangeDisplayImage("Groggy.jpg");

	misty.MoveHeadPosition(-5, 0, 0, 40, 0, 1000);	
	misty.ChangeLED(148, 0, 211);/*Purple*/
	
	misty.RandomPause(1000, 1500);
	misty.ChangeDisplayImage("Happy.jpg");
	Drive();    	
}


function Deactivate() {
	misty.Stop();
	misty.ChangeLED(0, 0, 0);/*Off*/
	misty.MoveHeadPosition(-5, 0, 0, 40, 0, 1000);	
	misty.ChangeDisplayImage("Content.jpg");
	
	misty.UnregisterEvent("FrontTOF");
	misty.UnregisterEvent("BackTOF");
}


function TimeOfFlight_Callback() {
	
	misty.Debug("tof0000!"); 
	/*TODO if left or right sensor, or far enough away, could simply steer with wall instead of stopping*/
	var data = misty.GetEventData("FrontTOF");
	var frontTOF = JSON.parse(data);
	
	misty.Debug("tof!"); 

	var distance = 0.4;
	 if (frontTOF !== undefined && frontTOF.PropertyTestResults[0] !== undefined && frontTOF.PropertyTestResults[0].PropertyParent != undefined && frontTOF.PropertyTestResults[0].PropertyParent.DistanceInMeters < 0.4) {
		misty.Debug("stop!"); 
		misty.Stop();
		distance = frontTOF.PropertyTestResults[0].PropertyParent.DistanceInMeters;
	 }


	
	const desired = 0.3;
    const k = 80;
	var velocity = distance ? (distance - desired)*k : 50;
	misty.Debug("this is velocity " + Math.floor(velocity));
    misty.Drive(Math.floor(velocity), 0, 0, 1000);
	RegisterEvents();
	 	
		//misty.Stop();
	//}
	//Drive();
	misty.StartFaceRecognition();

	//misty.UnregisterEvent("BackTOF");		
	//misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
	misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
	misty.AddPropertyTest("FaceRec", "PersonName", "===", "unknown person", "string");
	misty.RegisterEvent("FaceRec", "FaceRec_Callback", "FaceRecognition", 100);
		
}

/* Motions */
function Drive() {

	misty.Debug("Drive!");

	RegisterEvents();
	if(Math.round(Math.random()) === 0)
	{
		misty.Drive(20, 0, 0, 500);
	}
	else
	{
		misty.Drive(10, 0, 0, 1000);
	}
}

/*Event reg method*/
function RegisterEvents() {
	misty.Debug("Registering events");		
	misty.AddPropertyTest("FrontTOF", "SensorPosition", "!==", "Back", "string");
	//misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.6, "double");
	misty.RegisterEvent("FrontTOF", "TimeOfFlight_Callback", "TimeOfFlight", 100);
}


function FaceRec_Callback() {
	misty.Debug("Face rec callback");

	RespondToFace("Love.jpg", "004-WhaooooO.wav");
	misty.Stop();
	Drive();

}

function RespondToFace(img, snd) {
	misty.ChangeDisplayImage(img);
	misty.PlayAudioClip(snd);
	misty.Pause(3000);
	ResetDisplay();
	misty.Pause(3000);
}