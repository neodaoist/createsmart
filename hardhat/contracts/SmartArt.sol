// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "./ERC2981/ERC2981PerTokenRoyalties.sol";

///////////////////////////////////////////////////////////////////////////
//                                                                       //
//      ____                _         ____                       _       //
//     / ___|_ __ ___  __ _| |_ ___  / ___| _ __ ___   __ _ _ __| |_     //
//    | |   | '__/ _ \/ _` | __/ _ \ \___ \| '_ ` _ \ / _` | '__| __|    //
//    | |___| | |  __/ (_| | ||  __/  ___) | | | | | | (_| | |  | |_     //
//     \____|_|  \___|\__,_|\__\___| |____/|_| |_| |_|\__,_|_|   \__|    //
//                                                                       //
//                                                                       //
///////////////////////////////////////////////////////////////////////////

contract SmartArt is ERC1155, AccessControl, ERC1155Burnable, ERC2981PerTokenRoyalties {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string public name = "SmartArt";
    string public symbol = "SMARTART";

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl, ERC2981Base)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
