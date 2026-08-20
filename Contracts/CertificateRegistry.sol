
// pragma solidity ^0.8.17;

// contract CertificateRegistry {
//     address public owner;

//     constructor() {
//         owner = msg.sender;
//     }

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Only owner");
//         _;
//     }

//     struct OrgRequest {
//         address wallet;
//         string orgName;
//         string documentCID; // IPFS CID of proof document
//         bool reviewed;
//         bool approved;
//     }

//     mapping(address => bool) public isOrgApproved;
//     mapping(uint256 => OrgRequest) public requests;
//     uint256 public nextRequestId;

//     mapping(string => address) public certificateIssuer;

//     event OrgRequested(uint256 indexed requestId, address indexed wallet, string orgName, string documentCID);
//     event OrgApproved(uint256 indexed requestId, address indexed wallet, bool approved);
//     event CertificateIssued(address indexed issuer, string ipfsHash);

//     function requestApproval(string calldata orgName, string calldata documentCID) external {
//         uint256 id = nextRequestId++;
//         requests[id] = OrgRequest({
//             wallet: msg.sender,
//             orgName: orgName,
//             documentCID: documentCID,
//             reviewed: false,
//             approved: false
//         });
//         emit OrgRequested(id, msg.sender, orgName, documentCID);
//     }

//     function reviewRequest(uint256 requestId, bool approve) external onlyOwner {
//         OrgRequest storage r = requests[requestId];
//         require(r.wallet != address(0), "Invalid request");
//         r.reviewed = true;
//         r.approved = approve;
//         if (approve) {
//             isOrgApproved[r.wallet] = true;
//         }
//         emit OrgApproved(requestId, r.wallet, approve);
//     }

//     function revokeOrganization(address orgWallet) external onlyOwner {
//         isOrgApproved[orgWallet] = false;
//     }

//     function issueCertificate(string calldata ipfsHash) external {
//         require(isOrgApproved[msg.sender], "Not an approved organization");
//         certificateIssuer[ipfsHash] = msg.sender;
//         emit CertificateIssued(msg.sender, ipfsHash);
//     }

//     function verifyCertificate(string calldata ipfsHash) external view returns (address) {
//         return certificateIssuer[ipfsHash];
//     }

//     function bulkApprove(address[] calldata wallets) external onlyOwner {
//         for (uint i = 0; i < wallets.length; i++) {
//             isOrgApproved[wallets[i]] = true;
//         }
//     }
// }

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract DecentralizedOrgVerification is AccessControl, ReentrancyGuard {
    
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ORGANIZATION_ROLE = keccak256("ORGANIZATION_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    IERC20 public stakingToken;
    uint256 public organizationStakeAmount = 1000 * 10**18;
    uint256 public verifierStakeAmount = 500 * 10**18;
    
    enum OrgStatus { UNVERIFIED, PENDING, VERIFIED, REJECTED, SUSPENDED }
    enum VerificationLevel { NONE, LEVEL1, LEVEL2, LEVEL3 }
    
    struct Organization {
        address orgAddress;
        string orgName;
        string websiteUrl;
        string documentIpfsHash;
        OrgStatus status;
        VerificationLevel verificationLevel;
        uint256 stakeAmount;
        uint256 registrationDate;
        address[] verifiers;
        uint256 totalVerifications;
        uint256 rejectionVotes;
        bool isSuspended;
    }
    
    struct Verifier {
        address verifierAddress;
        uint256 stakeAmount;
        uint256 successfulVerifications;
        uint256 failedVerifications;
        uint256 communityRating;
        bool isActive;
    }
    
    mapping(address => Organization) public organizations;
    mapping(address => Verifier) public verifiers;
    mapping(address => mapping(address => bool)) public hasVoted;
    
    event OrganizationRegistered(address indexed orgAddress, string orgName, uint256 stakeAmount);
    event VerificationSubmitted(address indexed organization, address indexed verifier, bool approved);
    event OrganizationVerified(address indexed organization, VerificationLevel level);
    event OrganizationRejected(address indexed organization);
    
    constructor(address _stakingTokenAddress) {
        stakingToken = IERC20(_stakingTokenAddress);
        // _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _setupRole(ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    function registerOrganization(
        string memory _orgName,
        string memory _websiteUrl,
        string memory _documentIpfsHash
    ) external nonReentrant {
        require(organizations[msg.sender].orgAddress == address(0), "Already registered");
        require(bytes(_orgName).length > 0, "Name required");
        
        require(
            stakingToken.transferFrom(msg.sender, address(this), organizationStakeAmount),
            "Stake transfer failed"
        );
        
        organizations[msg.sender] = Organization({
            orgAddress: msg.sender,
            orgName: _orgName,
            websiteUrl: _websiteUrl,
            documentIpfsHash: _documentIpfsHash,
            status: OrgStatus.PENDING,
            verificationLevel: VerificationLevel.NONE,
            stakeAmount: organizationStakeAmount,
            registrationDate: block.timestamp,
            verifiers: new address[](0),
            totalVerifications: 0,
            rejectionVotes: 0,
            isSuspended: false
        });
        
        emit OrganizationRegistered(msg.sender, _orgName, organizationStakeAmount);
    }
    
    function becomeVerifier() external nonReentrant {
        require(verifiers[msg.sender].verifierAddress == address(0), "Already a verifier");
        
        require(
            stakingToken.transferFrom(msg.sender, address(this), verifierStakeAmount),
            "Stake transfer failed"
        );
        
        verifiers[msg.sender] = Verifier({
            verifierAddress: msg.sender,
            stakeAmount: verifierStakeAmount,
            successfulVerifications: 0,
            failedVerifications: 0,
            communityRating: 50,
            isActive: true
        });
    }
    
    function submitVerification(
        address _organization,
        bool _approved,
        string memory _evidence
    ) external {
        require(verifiers[msg.sender].isActive, "Not a verifier");
        require(organizations[_organization].orgAddress != address(0), "Organization not found");
        require(!hasVoted[_organization][msg.sender], "Already voted");
        
        hasVoted[_organization][msg.sender] = true;
        
        Organization storage org = organizations[_organization];
        org.verifiers.push(msg.sender);
        
        if (_approved) {
            org.totalVerifications++;
            verifiers[msg.sender].successfulVerifications++;
        } else {
            org.rejectionVotes++;
            verifiers[msg.sender].failedVerifications++;
        }
        
        emit VerificationSubmitted(_organization, msg.sender, _approved);
        
        checkVerificationStatus(_organization);
    }
    
    function checkVerificationStatus(address _organization) internal {
        Organization storage org = organizations[_organization];
        uint256 totalVotes = org.totalVerifications + org.rejectionVotes;
        
        if (totalVotes < 5) return;
        
        uint256 approvalPercentage = (org.totalVerifications * 100) / totalVotes;
        
        if (approvalPercentage >= 70) {
            org.status = OrgStatus.VERIFIED;
            org.verificationLevel = VerificationLevel.LEVEL1;
            _grantRole(ORGANIZATION_ROLE, _organization);
            emit OrganizationVerified(_organization, org.verificationLevel);
        } else if (approvalPercentage < 30 && totalVotes >= 5) {
            org.status = OrgStatus.REJECTED;
            uint256 slashAmount = (org.stakeAmount * 50) / 100;
            stakingToken.transfer(_organization, org.stakeAmount - slashAmount);
            emit OrganizationRejected(_organization);
        }
    }
    
    function issueCertificate(
        string memory _certificateHash,
        address _recipient,
        string memory _courseName
    ) external {
        require(hasRole(ORGANIZATION_ROLE, msg.sender), "Not approved");
        require(!organizations[msg.sender].isSuspended, "Suspended");
        require(organizations[msg.sender].status == OrgStatus.VERIFIED, "Not verified");
        
        // Certificate issuance logic
    }
    
    function getOrganizationDetails(address _org) external view returns (Organization memory) {
        return organizations[_org];
    }
    
    function getVerifierDetails(address _verifier) external view returns (Verifier memory) {
        return verifiers[_verifier];
    }
}