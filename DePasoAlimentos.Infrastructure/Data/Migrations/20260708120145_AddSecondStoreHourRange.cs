using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DePasoAlimentos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSecondStoreHourRange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeOnly>(
                name: "SecondCloseTime",
                table: "SpecialBusinessDays",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "SecondOpenTime",
                table: "SpecialBusinessDays",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "SecondCloseTime",
                table: "BusinessHours",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "SecondOpenTime",
                table: "BusinessHours",
                type: "time",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE [BusinessHours]
                SET
                    [OpenTime] = '09:30:00',
                    [CloseTime] = '13:00:00',
                    [SecondOpenTime] = '18:00:00',
                    [SecondCloseTime] = '21:00:00'
                WHERE [IsOpen] = 1;

                UPDATE [BusinessHours]
                SET
                    [OpenTime] = NULL,
                    [CloseTime] = NULL,
                    [SecondOpenTime] = NULL,
                    [SecondCloseTime] = NULL
                WHERE [IsOpen] = 0;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE [BusinessHours]
                SET
                    [OpenTime] = '09:00:00',
                    [CloseTime] = '20:00:00'
                WHERE [IsOpen] = 1;
                """);

            migrationBuilder.DropColumn(
                name: "SecondCloseTime",
                table: "SpecialBusinessDays");

            migrationBuilder.DropColumn(
                name: "SecondOpenTime",
                table: "SpecialBusinessDays");

            migrationBuilder.DropColumn(
                name: "SecondCloseTime",
                table: "BusinessHours");

            migrationBuilder.DropColumn(
                name: "SecondOpenTime",
                table: "BusinessHours");
        }
    }
}
