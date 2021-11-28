pragma solidity ^0.4.17;

contract SCeleitaContract {

    address public owner;
    uint projectCount;

    uint sponsorCount;

    bool start;
    bool end;

    // Constructor
    function SCeleitaContract() public {
        owner = msg.sender;
        projectCount = 0;
        sponsorCount = 0;
        start = false;
        end = false;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    // Only Admin can access
    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }

    struct Project{
        string name;
        string enterprise;
        string description;
        uint bidCount;
        uint enterprisenumber;
        uint projectId;
    }

    mapping(uint => Project) public projectDetails;

    // Only admin can add projects
    function addProject(string _name, string _enterprise, string _description, uint _enterprisenumber) public onlyAdmin {
        Project memory newProject = Project({
           name : _name,
           enterprise : _enterprise,
           description : _description,
           bidCount : 0,
           enterprisenumber : _enterprisenumber,
           projectId : projectCount
        });

        projectDetails[projectCount] = newProject;
        projectCount += 1;
    }

    // get total number of projects
    function getProjectNumber() public view returns (uint) {
        return projectCount;
    }

    struct Sponsor{
        address sponsorAddress;
        string name;
        string ID;
        uint enterprisenumber;
        bool hasBid;
        bool isVerified;
    }

    address[] public sponsors;
    mapping(address => Sponsor) public sponsorDetails;

    // request to be added as sponsor
    function requestSponsor(string _name, string _ID, uint _enterprisenumber) public {
        Sponsor memory newSponsor = Sponsor({
           sponsorAddress : msg.sender,
           name : _name,
           ID : _ID,
           enterprisenumber : _enterprisenumber,
           hasBid : false,
           isVerified : false
        });

        sponsorDetails[msg.sender] = newSponsor;
        sponsors.push(msg.sender);
        sponsorCount += 1;
    }

    // get total number of sponsor
    function getSponsorCount() public view returns (uint) {
        return sponsorCount;
    }

    function verifySponsor(address _address) public onlyAdmin {
        sponsorDetails[_address].isVerified = true;
    }

    function bid(uint projectId) public{
        require(sponsorDetails[msg.sender].hasBid == false);
        require(sponsorDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);

        projectDetails[projectId].bidCount += 1;
        sponsorDetails[msg.sender].hasBid = true;
    }

    function startBiding() public onlyAdmin {
        start = true;
        end = false;
    }

    function endBiding() public onlyAdmin {
        end = true;
        start = false;
    }

    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}