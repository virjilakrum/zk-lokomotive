// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IWormhole.sol";

contract WormholeMessenger is Ownable {
    using SafeERC20 for IERC20;

    IWormhole public wormhole;
    uint16 public targetChain;
    uint256 public nextSequence;
    IERC20 public wormholeToken;

    event HashSent(address indexed sender, bytes32 hash, uint64 sequence);
    event BridgeContractSet(uint16 chainId, bytes32 newBridgeContract);

    mapping(uint16 => bytes32) public bridgeContracts;

    constructor(address _wormhole, uint16 _targetChain, address _wormholeToken) {
        wormhole = IWormhole(_wormhole);
        targetChain = _targetChain;
        wormholeToken = IERC20(_wormholeToken);
    }

    function sendHash(bytes32 _hash) external payable {
        require(_hash != bytes32(0), "Hash bos olamaz");

        uint256 messageFee = wormhole.messageFee();
        require(msg.value >= messageFee, "Yetersiz ucret");

        bytes memory payload = abi.encode(msg.sender, _hash);

        uint64 sequence = wormhole.publishMessage{value: messageFee}(
            uint32(nextSequence),
            payload,
            targetChain
        );

        nextSequence++;

        emit HashSent(msg.sender, _hash, sequence);

        if (msg.value > messageFee) {
            payable(msg.sender).transfer(msg.value - messageFee);
        }
    }

    function sendHashWithToken(bytes32 _hash, uint256 amount) external {
        require(_hash != bytes32(0), "Hash bos olamaz");
        require(amount > 0, "Miktar sifirdan buyuk olmali");

        uint256 messageFee = wormhole.messageFee();
        require(wormholeToken.balanceOf(msg.sender) >= amount + messageFee, "Yetersiz bakiye");

        wormholeToken.safeTransferFrom(msg.sender, address(this), amount + messageFee);
        wormholeToken.safeApprove(address(wormhole), messageFee);

        bytes memory payload = abi.encode(msg.sender, _hash, amount);

        uint64 sequence = wormhole.publishMessage(
            uint32(nextSequence),
            payload,
            targetChain
        );

        nextSequence++;

        emit HashSent(msg.sender, _hash, sequence);
    }

    function verifyVM(IWormhole.VM memory vm) public view returns (bool) {
        return wormhole.parseAndVerifyVM(vm) == IWormhole.VM_STATUS_VALID;
    }

    function setBridgeContract(uint16 chainId, bytes32 bridgeContract) external onlyOwner {
        bridgeContracts[chainId] = bridgeContract;
        emit BridgeContractSet(chainId, bridgeContract);
    }

    function setTargetChain(uint16 _newTargetChain) external onlyOwner {
        targetChain = _newTargetChain;
    }

    function setWormhole(address _newWormhole) external onlyOwner {
        wormhole = IWormhole(_newWormhole);
    }

    function setWormholeToken(address _newWormholeToken) external onlyOwner {
        wormholeToken = IERC20(_newWormholeToken);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}

