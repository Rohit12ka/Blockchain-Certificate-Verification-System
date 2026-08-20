// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
   Organization Registry Contract
   ----------------------------------
   Features:
   ✔ Org registers itself (name, regNo, website, orgCertificateCID)
   ✔ Stored in mapping with wallet address as unique identifier
   ✔ Only contract owner (government/admin) can approve/verify
   ✔ Frontend on reload: simply connect wallet → instantly fetch stored data
   ✔ Organization does NOT need to re-verify again
   ✔ Can store multiple student certificate CIDs per organization
*/

contract OrganizationRegistry {
    address public owner;

    constructor() {
        owner = msg.sender; // deployer is admin (government)
    }

    // ========== DATA STRUCTURES ==========

    struct Organization {
        string name;
        string regNo;
        string website;
        string orgCertificateCID;
        bool isRegistered;
        bool isVerified;    // verified by admin
        string[] studentCertificates;  // student certificate CIDs
    }

    mapping(address => Organization) private orgs;

    // ========== EVENTS ==========
    event OrgRegistered(address indexed orgWallet, string name, string regNo);
    event OrgVerified(address indexed orgWallet, bool verified);
    event StudentCertificateAdded(address indexed orgWallet, string studentCID);

    // ========== MODIFIERS ==========
    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin/government can verify");
        _;
    }

    modifier onlyRegisteredOrg() {
        require(orgs[msg.sender].isRegistered, "Organization not registered");
        _;
    }

    // ========== FUNCTIONS ==========

    // 1) ORG REGISTRATION (CALLED BY ORGANIZATION)
    function registerOrganization(
        string memory _name,
        string memory _regNo,
        string memory _website,
        string memory _orgCertificateCID
    ) public {
        Organization storage o = orgs[msg.sender];

        o.name = _name;
        o.regNo = _regNo;
        o.website = _website;
        o.orgCertificateCID = _orgCertificateCID;
        o.isRegistered = true;

        emit OrgRegistered(msg.sender, _name, _regNo);
    }

    // 2) GOVERNMENT ADMIN VERIFICATION (CALLED BY OWNER)
    function verifyOrganization(address orgWallet, bool status) public onlyOwner {
        require(orgs[orgWallet].isRegistered, "Org not registered");

        orgs[orgWallet].isVerified = status;

        emit OrgVerified(orgWallet, status);
    }

    // 3) ORG ADDS STUDENT CERTIFICATES
    function addStudentCertificate(string memory studentCID) public onlyRegisteredOrg {
        orgs[msg.sender].studentCertificates.push(studentCID);
        emit StudentCertificateAdded(msg.sender, studentCID);
    }

    // 4) Fetch org data for frontend
    function getOrganization(address wallet)
        public
        view
        returns (
            string memory name,
            string memory regNo,
            string memory website,
            string memory orgCertificateCID,
            bool isRegistered,
            bool isVerified,
            string[] memory studentCertificates
        )
    {
        Organization storage o = orgs[wallet];
        return (
            o.name,
            o.regNo,
            o.website,
            o.orgCertificateCID,
            o.isRegistered,
            o.isVerified,
            o.studentCertificates
        );
    }
}
