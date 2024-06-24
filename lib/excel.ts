import { db } from "./db";
import ExcelJS from "exceljs"
import { WGAme, WRounds } from "./gameManager/interfaces";


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
    ]

    const sheet = workbook.addWorksheet(gameName);

    sheet.columns = [
        //lecturers 
        { header: 'adminId', key: 'adminId'},
        { header: 'email', key: 'email'},
        { header: 'name', key: 'name'},

        //game
        { header: 'gameID', key: 'gameID'},
        { header: 'adminID', key: 'adminID'},
        { header: 'gameFinePercent', key: 'gameFinePercent'},
        { header: 'auditProbability', key: 'auditProbability'},
        { header: 'kickPlayersOnBankruptcy', key: 'kickPlayersOnBankruptcy'},
        { header: 'maxPlayers', key: 'maxPlayers'},
        { header: 'taxCoefficient', key: 'taxCoefficient'},

        //rounds
        { header: 'roundId', key: 'roundId'},
        { header: 'universeId', key: 'universeId'},
        { header: 'universeMoneyPool', key: 'universeMoneyPool'},

        //player
        { header: 'playerId', key: 'playerId'},
        { header: 'playerName', key: 'playerName'},

        //minister
        { header: 'ministerTaxRate', key: 'ministerTaxRate'},
        { header: 'ministerDistributedTaxReturns', key: 'ministerTaxRate'},
        
        //normal players
        { header: 'playerIncome', key: 'playerIncome'},
        { header: 'playerDeclaredIncome', key: 'playerDeclaredIncome'},
        { header: 'playerTaxReturns', key: 'playerTaxReturns'},
        { header: 'playersIsAudited', key: 'playersIsAudited'},
        { header: 'playerFineAmount', key: 'playerFineAmount'},
        { header: 'playerTotalFunds', key: 'playerTotalFunds'},

    ]
}