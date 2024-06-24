import ExcelJS from "exceljs";
import { WGAme, WRounds, WPlayer } from "&/gameManager/interfaces";

export const createExcelWorkbook = (creatorName: string, gameName: string, game: WGAme) => {

    const workbook = new ExcelJS.Workbook();
    workbook.lastModifiedBy = creatorName;
    workbook.creator = creatorName;
    workbook.created = new Date();
    workbook.modified = new Date();

    workbook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
    ];

    const sheet = workbook.addWorksheet(gameName);

    sheet.columns = [
        // Admin columns
        { header: 'adminId', key: 'adminId' },
        { header: 'adminEmail', key: 'adminEmail' },
        { header: 'adminName', key: 'adminName' },

        // Game columns
        { header: 'gameID', key: 'gameID' },
        { header: 'adminID', key: 'adminID' },
        { header: 'gameFinePercent', key: 'gameFinePercent' },
        { header: 'auditProbability', key: 'auditProbability' },
        { header: 'kickPlayersOnBankruptcy', key: 'kickPlayersOnBankruptcy' },
        { header: 'maxPlayers', key: 'maxPlayers' },
        { header: 'taxCoefficient', key: 'taxCoefficient' },

        // Round columns
        { header: 'roundId', key: 'roundId' },
        { header: 'universeId', key: 'universeId' },
        { header: 'universeMoneyPool', key: 'universeMoneyPool' },

        // Player columns
        { header: 'playerId', key: 'playerId' },
        { header: 'playerName', key: 'playerName' },
        { header: 'ministerTaxRate', key: 'ministerTaxRate' },
        { header: 'ministerDistributedTaxReturns', key: 'ministerDistributedTaxReturns' },
        { header: 'playerIncome', key: 'playerIncome' },
        { header: 'playerDeclaredIncome', key: 'playerDeclaredIncome' },
        { header: 'playerTaxReturns', key: 'playerTaxReturns' },
        { header: 'playerIsAudited', key: 'playerIsAudited' },
        { header: 'playerFineAmount', key: 'playerFineAmount' },
        { header: 'playerTotalFunds', key: 'playerTotalFunds' },
    ];

    // Add data rows
    const admin = game.admin;
    const gameData = game.game;

    // Admin row
    sheet.addRow({
        adminId: admin.adminId,
        adminEmail: admin.email,
        adminName: admin.name,
        //todo: fix this
        gameID: "1",
        adminID: game.admin,
        gameFinePercent: gameData.finePercent,
        auditProbability: gameData.auditProbability,
        kickPlayersOnBankruptcy: gameData.kickPlayersOnBankruptcy,
        maxPlayers: gameData.maxPlayers,
        taxCoefficient: gameData.taxCoefficient,
    });

    // Round rows
    gameData.rounds.forEach((round: WRounds) => {
        sheet.addRow({
            roundId: round.id,
            universeId: round.universeID,
            universeMoneyPool: round.universeMoneyPool,
        });
    });

    // Player rows
    gameData.players.forEach((player: WPlayer) => {
        sheet.addRow({
            playerId: player.id,
            playerName: player.name,
            ministerTaxRate: player.setTaxRate ? player.setTaxRate.join(', ') : '',
            ministerDistributedTaxReturns: player.redistributedTax ? player.redistributedTax.join(', ') : '',
            playerIncome: player.playerIncome ? player.playerIncome.join(', ') : '',
            playerDeclaredIncome: player.playerDeclaredIncome ? player.playerDeclaredIncome.join(', ') : '',
            playerTaxReturns: player.playerTaxReturns ? player.playerTaxReturns.join(', ') : '',
            playerIsAudited: player.playerIsAudited ? player.playerIsAudited.join(', ') : '',
            playerFineAmount: player.playerFineAmount.join(', '),
            playerTotalFunds: player.funds.join(', '),
        });
    });

    // Write the workbook to a file or stream
    workbook.xlsx.writeFile('gameWorkbook.xlsx')
        .then(() => {
            console.log('Workbook created successfully.');
        })
        .catch((err) => {
            console.error('Error creating workbook:', err);
        });
};
