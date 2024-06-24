import ExcelJS from 'exceljs';
import { WGame, WPlayer, WRounds } from '../lib/gameManager/interfaces';

export const createExcelWorkbook = (creatorName: string, gameName: string, game: WGame) => {
    const workbook = new ExcelJS.Workbook();
    workbook.lastModifiedBy = creatorName;
    workbook.creator = creatorName;
    workbook.created = new Date();
    workbook.modified = new Date();

    workbook.views = [
        {
            x: 0,
            y: 0,
            width: 10000,
            height: 20000,
            firstSheet: 0,
            activeTab: 1,
            visibility: 'visible',
        },
    ];


    try {

    // Function to add data to each sheet
    const addSheetData = (sheetName: string, data: any[], columns: any[]) => {
        const sheet = workbook.addWorksheet(sheetName);
        sheet.columns = columns;

        data.forEach(row => {
            sheet.addRow(row).commit(); // Add rows by committing them
        });
    };

    // Admin sheet
    const adminSheetData = [{
        adminId: game.admin.adminId,
        adminEmail: game.admin.email,
        adminName: game.admin.name,
    }];
    const adminColumns = [
        { header: 'adminId', key: 'adminId' },
        { header: 'adminEmail', key: 'adminEmail' },
        { header: 'adminName', key: 'adminName' },
    ];
    addSheetData('Admin', adminSheetData, adminColumns);

    // Game sheet
    const gameSheetData = [{
        adminId: game.admin.adminId,
        gameFinePercent: game.game.finePercent,
        auditProbability: game.game.auditProbability,
        kickPlayersOnBankruptcy: game.game.kickPlayersOnBankruptcy,
        maxPlayers: game.game.maxPlayers,
        taxCoefficient: game.game.taxCoefficient,
    }];
    const gameColumns = [
        { header: 'adminId', key: 'adminId' },
        { header: 'gameFinePercent', key: 'gameFinePercent' },
        { header: 'auditProbability', key: 'auditProbability' },
        { header: 'kickPlayersOnBankruptcy', key: 'kickPlayersOnBankruptcy' },
        { header: 'maxPlayers', key: 'maxPlayers' },
        { header: 'taxCoefficient', key: 'taxCoefficient' },
    ];
    addSheetData('Game', gameSheetData, gameColumns);

    // Rounds sheet
    const roundsSheetData = game.game.rounds.map((round: WRounds) => ({
        roundId: round.id,
        universeId: round.universeID,
        universeMoneyPool: round.universeMoneyPool,
    }));
    const roundsColumns = [
        { header: 'roundId', key: 'roundId' },
        { header: 'universeId', key: 'universeId' },
        { header: 'universeMoneyPool', key: 'universeMoneyPool' },
    ];
    addSheetData('Rounds', roundsSheetData, roundsColumns);

    

    // Players sheet
    const playersSheetData = game.game.players.flatMap((player: WPlayer) => {
        const ministerTaxRate = player.setTaxRate ? player.setTaxRate.join(', ') : '';
        const ministerDistributedTaxReturns = player.redistributedTax ? player.redistributedTax.join(', ') : '';
        const playerIncome = player.playerIncome ? player.playerIncome.join(', ') : '';
        const playerDeclaredIncome = player.playerDeclaredIncome ? player.playerDeclaredIncome.join(', ') : '';
        const playerTaxReturns = player.playerTaxReturns ? player.playerTaxReturns.join(', ') : '';
        const playerIsAudited = player.playerIsAudited ? player.playerIsAudited.join(', ') : '';

        return player.funds.map((funds, index) => ({
            playerId: player.id,
            playerName: index === 0 ? player.name : '', // Include player name only once
            ministerTaxRate,
            ministerDistributedTaxReturns,
            playerIncome,
            playerDeclaredIncome,
            playerTaxReturns,
            playerIsAudited,
            playerFineAmount: player.playerFineAmount.join(', '),
            playerTotalFunds: funds,
        }));
    });
    const playersColumns = [
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
    addSheetData('Players', playersSheetData, playersColumns);

    // Write the workbook to a file or stream
    workbook.xlsx.writeFile('gameWorkbook.xlsx')
        .then(() => {
            console.log('Workbook created successfully.');
        })
        .catch((err) => {
            console.error('Error creating workbook:', err);
        });

      } catch(c) {
        console.error(c)
      }
};
