import { MissingDriverError } from "../error/MissingDriverError";
import { MongoDriver } from "./mongodb/MongoDriver";
import { WebsqlDriver } from "./websql/WebsqlDriver";
import { SqlServerDriver } from "./sqlserver/SqlServerDriver";
import { OracleDriver } from "./oracle/OracleDriver";
import { SqliteDriver } from "./sqlite/SqliteDriver";
import { CordovaDriver } from "./cordova/CordovaDriver";
import { MysqlDriver } from "./mysql/MysqlDriver";
import { PostgresDriver } from "./postgres/PostgresDriver";
/**
 * Helps to create drivers.
 */
var DriverFactory = /** @class */ (function () {
    function DriverFactory() {
    }
    /**
     * Creates a new driver depend on a given connection's driver type.
     */
    DriverFactory.prototype.create = function (connection) {
        var type = connection.options.type;
        switch (type) {
            case "mysql":
                return new MysqlDriver(connection);
            case "postgres":
                return new PostgresDriver(connection);
            case "mariadb":
                return new MysqlDriver(connection);
            case "sqlite":
                return new SqliteDriver(connection);
            case "cordova":
                return new CordovaDriver(connection);
            case "oracle":
                return new OracleDriver(connection);
            case "mssql":
                return new SqlServerDriver(connection);
            case "websql":
                return new WebsqlDriver(connection);
            case "mongodb":
                return new MongoDriver(connection);
            default:
                throw new MissingDriverError(type);
        }
    };
    return DriverFactory;
}());
export { DriverFactory };

//# sourceMappingURL=DriverFactory.js.map
